# tabelog-web-project

このプロジェクトではコマンドラインで作成したtabelogデータを活用した  
グループ内での最適なお店選びシステムをwebアプリ化するプロジェクトである

---

## エラーでつまずいたところ①

コンテナを起動する際にDBコンテナが起動する前にBackendコンテナが起動してしまう  
ことでBackendでエラーが起きた  
→対処方法 docker-compose.yml で DB が起動してから Backend コンテナを起動するように設定でクリア

---

## エラーでつまずいたところ②

コンテナは起動できたが、VScodeでコンテナを開く際は .devcontainer の設定を行う必要があった。  
作成したはずの /app（ワークスペース）がないと怒られたので .devcontainer の書き方を記事で読んで応用させた。  
.devcontainer 内で workspace を明示させてエラー処理した。

以下が参考記事  
→ https://qiita.com/1mono2/items/5bbf91f588ab9d5cd444

---

## エラーでつまずいたところ③

front のコンテナが VScode で開けなかった。  
→ 問題点は node_module の容量が大きすぎて front を docker で開く際のタイムアウトに引っかかった。  
.dockerignore ファイルを作成し、重いモジュールは無視することにした。

---

# container の問題はおおむね解決した

作業をするときは必ずコンテナに入ってから行う。  
docker-compose.yml がある場所で `docker-compose up` ですべてのコンテナを起動。  
`docker-compose exec backend bash` で backend や frontend のコンテナに移動してから  
`python manage.py` などのコマンドを入力する。  

backend のみの起動だと Docker ネットワークの db と backend のネットワークが切れてしまうため。

---

# スクレイピング関連のエラー

## エラーでつまずいたところ④

selenium のセッションエラー  
→ エラー文より chrome と chromedriver のバージョンの不一致

原因:  
最新バージョンを自動で取得しようとすると、自動的にバージョン 144.~ がインストールされる。  
しかし、chrome のバージョンが 122.~ なので一致しないことによるエラー。

バックエンドの Dockerfile より RUN コマンドから手動で 122.~ の chromedriver をインストールすることで対策。

---

## エラーでつまずいたところ⑤

API を叩いた時の画面上に出てきたエラー文の内容:

KeyError at /api/tabelog/run/
['住所']

kotlin
コードをコピーする

→ 本質的なエラーではなく、副次的に起きたエラーである。

data を確認したところ、Selenium で店舗情報が取得できない。

エラーした csv ファイル:
星5段階評価,
3.34,Non-Info
3.28,Non-Info
3.26,Non-Info
3.45,Non-Info
3.14,Non-Info
3.21,Non-Info

---

### (1) エラーの分析

- selenium は起動している  
　→ 設定には誤りはない、バージョンのエラーは解決できている  
- URL の取得はできてる  
- 一店舗ごとの URL ページの遷移はできてる  
- 1 店舗の星五段階評価は取得できているが店舗情報の取得に失敗している？  
　仮説として、要素を取り出す前に次のページに遷移している？  
　→ タイムアウトになれば  
　　`print(f"要素が見つかりませんでした: {value}")`  
　　が表示されるはず → 問題なかった

---

### コマンドラインで確認する

tabelog-backend | 店舗基本情報を見つけることに成功
tabelog-backend | 星5段階情報取得成功
tabelog-backend | 項目名取得成功
...


→ 項目名の取得はできてるが具体的なデータがわからない  
→ print 文を用いて項目名とそのデータを確認する

結果:

星5段階情報取得成功
tabelog-backend | の項目名取得成功
tabelog-backend | の項目バリュー:
tabelog-backend | Non-Infoのデータ取得成功
...


→ th_text, td_text に何も入っていないことが分かった

---

### 原因追及

- 店舗情報の要素の取得に成功しているか？  
- tr に何が入っているか確認すると:

<tr> <th>店名</th> <td><span>旨いもん屋 ごち</span></td> </tr> ```
→ 要素は存在していた。
ではなぜ <th> と <td> の要素が取り出せない？

th の取り出し方を変更してみることに

th_text = (
    tr.find_element(By.TAG_NAME, "th").get_attribute("textContent").strip()
)
→ 項目名は取得できるようになった！

td も同様に変更：

変更前:

td_text = tr.find_element(By.TAG_NAME, "td").text

変更後:

td_text = (
    tr.find_element(By.TAG_NAME, "td")
    .get_attribute("textContent")
    .strip()
)
(2) 原因の考察
取得してきたページの要素がコマンドライン上で動かして取得してきたページと異なる

tabelog の DOM の構造が変化していたことが原因
→ 従来のスクレイピング方法だと要素の内容を取得できなかった

改善点
要素の標準化による計算が妥当かどうか確かめる必要がありそう
次回の課題

