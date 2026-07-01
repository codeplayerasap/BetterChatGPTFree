# Sanitätshaus Danzeisen – statische 3D-Webseite
# nginx serviert die Seite mit korrekten MIME-Types für die ES-Module.
FROM nginx:1.27-alpine

# Standard-nginx-Config durch unsere ersetzen (MIME für .mjs, Caching, gzip)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Webseite ins Web-Root kopieren
COPY index.html /usr/share/nginx/html/index.html
COPY css/       /usr/share/nginx/html/css/
COPY js/        /usr/share/nginx/html/js/
COPY vendor/    /usr/share/nginx/html/vendor/

# Sicherstellen, dass der nginx-User alle Dateien/Ordner lesen kann
RUN chmod -R a+rX /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
