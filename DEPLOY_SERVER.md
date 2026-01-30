# Настройка сервера для деплоя

## Ошибка MIME: "Expected JavaScript but server responded with text/html"

Возникает, когда сервер отдаёт `index.html` вместо файла JS (например `/assets/index-XXX.js`).

**Nginx:** в `location /` обязательно используйте `try_files`, чтобы сначала отдавались реальные файлы:

```nginx
server {
  root /path/to/your/dist;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Тогда запросы к `/assets/*` будут отдавать файлы из `dist/assets/`, а не HTML.
