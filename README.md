# tabelog-web-project
このプロジェクトではコマンドラインで作成したtabelogデータを活用した
グループ内での最適なお店選びシステムを
webアプリ化するプロジェクトである

##エラーでつまずいたところ①
コンテナを起動する際にDBコンテナが起動する前にBackendコンテナが起動してしまう
ことでBackendでエラーが起きた
→対処方法docker-compose.ymlでDBが起動してからBackendコンテナを起動するように設定でクリア

##エラーでつまずいたところ②
コンテナは起動できたが、VScodeでコンテナを開く際は.devcontainerの設定を行う必要があった。
作成したはずの/app（ワークスペース）がないと怒られたので.devcontainerの書き方を記事で読んで応用させた
.devcontainer内でworkspaceを明示させてエラー処理した
以下が参考記事
→https://qiita.com/1mono2/items/5bbf91f588ab9d5cd444

##エラーでつまずいたこと③
frontのコンテナがVScodeで開けなかった。
→問題点はnode_moduleの要領が大きすぎてfrontをdockerで開く際のタイムアウトに引っかかった
.dockerignoreファイルを作成し、重いモジュールは無視することにした

----containerの問題はおおむね解決した-----

作業をするときは必ずコンテナに入ってから行う
docker-compose.ymlがある場所でdocker-compose up
ですべてのコンテナを起動
docker-compose exec backend bash
でbackendやfrontendのコンテナに移動してからpython manage.pyなどのコマンドを入力する
backendのみの起動だとDockerネットワークのdbとbackendのネットワークが切れてしまうため

#エラーで躓いたところ④
seleniumのセッションエラー
　→エラー文よりchronmとchromedriverのバージョンの不一致

　　原因:
　　最新バージョンを自動で取得しようとすると、自動的にバージョンが144.~がインストールされる
　　しかし、chromeのバージョンが122.~なので一致しないことによるエラー。

　 バックエンドのDockerfileよりRUNコマンドより手動で122.~のchromedriverをインストールすることで対策。


#エラーでつまずいたところ⑤

apiをたたいた時の画面上に出てきたエラー文の内容:
  KeyError at /api/tabelog/run/
  ['住所']

dataを確認したところ、Seleniumで店舗情報が取得できない
エラーしたcsvファイル:
    星5段階評価,
        3.34,Non-Info
        3.28,Non-Info
        3.26,Non-Info
        3.45,Non-Info
        3.14,Non-Info
        3.21,Non-Info

  (1)エラーの分析
  　・seleniumは起動している
  　・URLの取得はできてる
  　・一店舗ごとのURLページの遷移はできてる
  　・1店舗の星五段階評価は取得できているが店舗情報の取得に失敗している？
  　　→要素の取得に失敗orタイムアウトになればprint(f"要素が見つかりませんでした: {value}")が表示される
  　　　→問題なかった

  　・コマンドラインで確認する
    　　tabelog-backend   | 店舗基本情報を見つけることに成功
    　　tabelog-backend   | 星5段階情報取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功
        tabelog-backend   | 項目名取得成功

        →項目名の取得はできてるが具体的なデータがわからない
         print文を用いて項目名とそのデータを取得して確認する
         結果:
            星5段階情報取得成功
            tabelog-backend   | の項目名取得成功
            tabelog-backend   | の項目バリュー:
            tabelog-backend   | Non-Infoのデータ取得成功
            tabelog-backend   | の項目名取得成功
            tabelog-backend   | の項目バリュー:
            tabelog-backend   | Non-Infoのデータ取得成功
            tabelog-backend   | の項目名取得成功
            tabelog-backend   | の項目バリュー:

            →th_text, td_textに何も入っていないことが分かった

        print文を入れて細かく原因を探る
        →店舗情報の要素の取得に成功しているか?
        →trに何が入っているか確認する
        　<tr>
            　<th>店名</th>
            　<td><span>旨いもん屋 ごち</span></td>
        　</tr>

        　→ちゃんと要素は入っていた。ではなぜ<th>と<td>の要素が取り出せない?
           →trの中のthの取り出し方に問題がある
           th_text = (
                tr.find_element(By.TAG_NAME, "th").get_attribute("textContent").strip()
            )

            取り出し方を変えてみた
            →項目名はちゃんと取り出せるようになった!!!

            <td>も
            (変更前)
            td_text = tr.find_element(By.TAG_NAME, "td").text

            (変更後)
            td_text = (
                    tr.find_element(By.TAG_NAME, "td")
                    .get_attribute("textContent")
                    .strip()
                )




　(2)原因の考察
　　　・取得してきたページの要素がコマンドライン上で動かして取得してきたページと
　　　　異なる
　　　　→tabelogのDOMの構造が変化していたことが原因で従来のスクレイピングの方法だと
　　　　　要素の内容を取得できなかった

#改善点
要素の標準化による計算が妥当かどうか確かめる必要がありそう
次回の課題


　　　





