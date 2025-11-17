# tabelog-web-project
このプロジェクトではコマンドラインで作成したtabelogデータを活用した
グループ内での最適なお店選びシステムを
webアプリ化するプロジェクトである

##エラーでつまずいたところ①
コンテナを起動する際にDBコンテナが起動する前にBackendコンテナが起動してしまう
ことでBackendでエラーが起きた
→対処方法docker-compose.ymlでDBが起動してからBackendコンテナを起動するように設定でクリア

##エラーでつまずいたところ②
コンテナは起動できたが、VScodeでコンテナを開く際はcontainer.devの設定を行う必要があった。
作成したはずの/app（ワークスペース）がないと怒られたので.devcontainerの書き方を記事で読んで応用させた
.devcontainer内でworkspaceを明示させてエラー処理した
以下が参考記事
→https://qiita.com/1mono2/items/5bbf91f588ab9d5cd444

##エラーでつまずいたこと
frontのコンテナがVScodeで開けなかった。
→問題点はnode_moduleの要領が大きすぎてfrontをdockerで開く際のタイムアウトに引っかかった
.dockerignoreファイルを作成し、重いモジュールは無視することにした

----containerの問題はおおむね解決した-----

作業をするときは必ずコンテナに入ってから行う
docker-compose.ymlがある場所でdocker-compose up
ですべてのコンテナを起動
docker-compose exec backend bash
でbackendやfrontendのコンテナに移動してからpython manage.pyなどのコマンドを入力する






