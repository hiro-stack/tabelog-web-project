FROM node:20-bullseye-slim


# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set environment variable
ENV DEVCONTAINER=true

# 作業ディレクトリ
WORKDIR /app

# まず package.json と yarn.lock をコピー
COPY package.json ./
COPY yarn.lock ./

# 依存パッケージをインストール
RUN yarn install

# 残りのソースコードをコピー
COPY . .

# サーバー起動
CMD ["yarn", "start"]
