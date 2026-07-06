FROM node:22-alpine

WORKDIR /app/server
ENV NODE_ENV=production

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . ./

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/v1/health').then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"

USER node
CMD ["npm", "start"]
