##問題点→appディレクトリを作成しているがその中に正しいコードが
##入っていない。COPYコマンドのパスを修正する必要がある。
##今のところ問題なく動いているが突っ込まれたときしんどい

# Python 3.12 のスリムイメージ
FROM python:3.12-slim


# 必要な OS パッケージをインストール
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*


# 作業ディレクトリ
WORKDIR /app

# プロジェクトルートから requirements.txt をコピー
COPY requirements.txt ./ 

RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# サーバー起動
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]