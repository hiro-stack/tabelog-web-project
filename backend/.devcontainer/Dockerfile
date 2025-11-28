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
    wget unzip xvfb libxi6 libnss3 libatk1.0-0 libcups2 libxss1 \
    libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxrandr2 \
    libxext6 libpangocairo-1.0-0 libgtk-3-0 chromium chromium-driver \
    && rm -rf /var/lib/apt/lists/*

# 手動で ChromeDriver をダウンロード（バージョン 142）
RUN wget https://storage.googleapis.com/chrome-for-testing-public/142.0.7444.175/linux64/chromedriver-linux64.zip \
    -O /tmp/chromedriver.zip && \
    unzip -j /tmp/chromedriver.zip 'chromedriver-linux64/chromedriver' -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm /tmp/chromedriver.zip

# 作業ディレクトリ
WORKDIR /app

# プロジェクトルートから requirements.txt をコピー
COPY requirements.txt ./ 

RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . . 

# サーバー起動
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]