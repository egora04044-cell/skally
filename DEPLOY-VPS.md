# Деплой Scally на VPS (Ubuntu/Debian)

Как у соседнего проекта на диске: Next.js через **Node + PM2 + Nginx**, HTTPS через **Certbot**.

## Оглавление по шагам

| № | Этап |
|---|------|
| 0 | ВПС, домен, DNS, SSH |
| 1 | Node.js 20 и PM2 |
| 2 | Код репозитория на сервере |
| 3 | `.env.production` |
| 4 | Первый `./deploy.sh` |
| 5 | Nginx |
| 6 | HTTPS (Certbot) |
| 7 | Обновления (`git pull` + деплой) |

## 0. Подготовка

- Возьмите **VPS** с **Ubuntu 22.04/24.04** или **Debian 12**, публичный **IP**.
- В фаерволе/панели провайдера откройте **22** (SSH), **80** и **443** (сайт).
- **Домен:** у регистратора добавьте **A** для `@` → IP сервера; при необходимости **A** для `www` → тот же IP (или CNAME `www` → `@`, если регистратор так умеет).
- Проверьте **SSH** с вашего ПК: `ssh пользователь@IP` (логин `root` или пользователь с `sudo`).

Дальше — только после того, как заходите по SSH.

## 1. Node.js и PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

## 2. Код на сервере

```bash
sudo mkdir -p /var/www/scally
sudo chown -R "$USER:$USER" /var/www/scally
cd /var/www/scally

# Вариант A: Git
git clone <ваш-remote> .

# Вариант B: с вашего ПК (из папки проекта)
# rsync -avz --exclude node_modules --exclude .next ./ user@SERVER:/var/www/scally/
```

## 3. Переменные окружения

Next на сервере читает **`/var/www/scally/.env.production`** (и при необходимости `.env.local`).

```bash
cd /var/www/scally
nano .env.production
```

Минимум для продакшена:

```
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
```

По желанию (см. `.env.example`): `CANONICAL_SITE_HOST`, `NEXT_PUBLIC_LEGAL_EMAIL`, `NEXT_PUBLIC_OPERATOR_ADDRESS`.

Пересоберите приложение после смены `NEXT_PUBLIC_*`.

## 4. Первый запуск

```bash
cd /var/www/scally
chmod +x deploy.sh
./deploy.sh
pm2 startup
pm2 save
```

Приложение слушает **порт `3000`** на localhost (меняется в `ecosystem.config.cjs`).

## 5. Nginx

```bash
sudo cp /var/www/scally/nginx.conf.example /etc/nginx/sites-available/scally
sudo nano /etc/nginx/sites-available/scally
```

Замените `example.com` и `www.example.com` на ваш домен:

```
server_name ваш-домен.ru www.ваш-домен.ru;
```

Включите сайт и перезагрузите Nginx:

```bash
sudo ln -sf /etc/nginx/sites-available/scally /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. HTTPS (Let’s Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

После выдачи сертификата Nginx будет слушать 443; при необходимости включите редирект HTTP→HTTPS в сгенерённом блоке или в конфиге Certbot.

## 7. Обновление после правок в Git

На сервере:

```bash
cd /var/www/scally
git pull
./deploy.sh
```

## Заметки по безопасности

- HSTS частично задаётся в `next.config.ts` в режиме `production`; доменный SSL и канонический `www`/apex можно донастроить на **Nginx или Cloudflare** в дополнение к `CANONICAL_SITE_HOST` в `.env`.
- Не коммитьте секреты: на сервере только `.env.production`/`.env.local`, не попадающие в репозиторий.
