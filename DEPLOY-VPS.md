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
| 5 | Nginx (в т.ч. ISPmanager / FirstVDS) |
| 6 | HTTPS (Certbot) — если не через панель |
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

# Вариант A: Git (репозиторий на GitHub может называться иначе папки локально)
git clone https://github.com/egora04044-cell/skally.git .

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
CANONICAL_SITE_HOST=ваш-домен.ru
```

(`CANONICAL_SITE_HOST` — без `https://` и без порта; тот host, который считаете каноном, с `www` или без.)

Афиша из CSV (как локально с `CONCERTS_SHEET_CSV_URL` в `.env`; если не задать — подставится дефолт из кода):

```
CONCERTS_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/…/export?format=csv&gid=…
```

По желанию (см. `.env.example`): `NEXT_PUBLIC_LEGAL_EMAIL`, `NEXT_PUBLIC_OPERATOR_ADDRESS`.

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

### Вариант A — только nginx (VPS без панели)

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

### Вариант B — ISPmanager / FirstVDS (заглушка вместо сайта)

Если домен создан в панели и выдан SSL, панель обычно поднимает vhost с **`root`** в каталог вида  
`/var/www/www-root/data/www/ваш-домен/` и кладёт **заглушку ISP** — в ответе будут **`ETag`**, **`Last-Modified`**, **нет** заголовков Next (`Content-Security-Policy`, длинный `Vary`, и т.д.).  
Приложение при этом может быть живым на **`http://127.0.0.1:3000`**.

**Что сделать на сервере:**

1. Убедиться, что Next запущен: `pm2 list`, `curl -sI http://127.0.0.1:3000 | head -20`.
2. В ISPmanager для WWW-домена включить **реверс-прокси** на **`http://127.0.0.1:3000`** (название шага зависит от версии: прокси / reverse proxy / порт бэкенда).
3. Если в интерфейсе нет режима прокси — править конфиг vhost в **`/etc/nginx/vhosts/.../ваш-домен.conf`** (панель может **перезаписать** файл при следующем сохранении сайта; надёжнее настроить прокси в UI).  
   В **`server { listen …:443 … }`** для основного сайта используйте **`location ^~ /`** с **`proxy_pass http://127.0.0.1:3000;`**, а не раздачу файлов из `root`. Готовый блок — в репозитории **`nginx.ispmanager-snippet.conf`**. Модификатор **`^~`** обязателен: иначе `include` панели перехватит `/_next/static/*.css`, `/hero-*.webp` и favicon.
4. У панели часто **`listen 109.x.x.x:443 ssl`** (привязка к IP). Конфиг из **`sites-enabled/scally`** с общим `listen 443` может **не использоваться** для этого домена — ориентируйтесь на файл в **`/etc/nginx/vhosts/`**, который попадает в вывод **`sudo nginx -T | grep ваш-домен`**.

**Сайт без стилей или без фото героя:** главная отдаётся Next, но **`/_next/static/…`**, **`/hero-desktop.webp`**, **`/hero-mobile.webp`** — **404** от nginx. Причина: `include` панели добавляет `location ~* \.(css|js|webp|…)$` с `root`. В **обоих** `server` (80 и 443) замените **`location /`** на **`location ^~ /`** из **`nginx.ispmanager-snippet.conf`**. Проверка:

```bash
curl -sI "https://ваш-домен.ru/hero-desktop.webp"   # 200, Content-Type: image/webp
curl -sI "https://ваш-домен.ru/_next/static/chunks/…css"  # 200, text/css
```

**Убрать дубли:** если правите vhost панели, отключите лишний symlink, чтобы не было двух `server` с одним `server_name`:

```bash
sudo rm -f /etc/nginx/sites-enabled/scally
sudo nginx -t && sudo systemctl reload nginx
```

**Проверка с доменом и с localhost:**

```bash
curl -sI http://127.0.0.1:3000 | head -25
curl -sI https://ваш-домен.ru | head -25
```

Заголовки с **HTTPS** должны быть **как у порта 3000** (CSP, политики, `Vary` с `next-router-…` и т.п.). Если с HTTPS снова «короткий» ответ с **только** `ETag` / без CSP — запрос всё ещё идёт в **статический root** панели, а не в Next.

## 6. HTTPS (Let’s Encrypt)

Если SSL уже выдан **в панели (FirstVDS / ISPmanager)** — этот шаг можно **пропустить**. Иначе классически:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

После выдачи сертификата Nginx будет слушать 443; при необходимости включите редирект HTTP→HTTPS в сгенерённом блоке или в конфиге Certbot.

**После смены SSL в панели** проверьте, что блок **443** для домена по-прежнему содержит **`proxy_pass`** на **3000**, а не вернулся к одному только `root`.

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
