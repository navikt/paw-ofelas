FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp

COPY .next/standalone /app/
COPY .next/static /app/.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV TZ="Europe/Oslo"

CMD ["server.js"]

