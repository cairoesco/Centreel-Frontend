FROM node:10-alpine
RUN apk update && apk add openssh
RUN npm install -g @angular/cli

ARG USER_ID
ARG GROUP_ID

# add user with specified (or default) user/group ids
ENV USER_ID ${USER_ID:-111}
ENV GROUP_ID ${GROUP_ID:-115}

RUN addgroup -S app -g ${GROUP_ID} && adduser -u ${USER_ID} -S -G app app 