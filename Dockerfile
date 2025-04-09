ARG IMAGE=node:23.11-alpine3.20

FROM ${IMAGE} AS build

COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npx nest build



FROM ${IMAGE} as deps

COPY ./package*.json ./
RUN npm ci --omit=dev



FROM ${IMAGE} as final

COPY --from=deps ./node_modules ./node_modules
COPY --from=build ./dist ./dist

CMD [ "node", "./dist/main" ]