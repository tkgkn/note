cd .vuepress

node create-sider.js

echo '创建目录结构完成'

yarn build

echo '编译静态资源完成'

wait

scp -r dist czm:/data/home/www/blog/