module.exports={
    lintOnSave:false,
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/': {
                target: 'http://localhost:8081',
                ws: true, // proxy websockets
                changeOrigin: true, // needed for virtual hosted sites
                pathRewrite: {
                    '^': ''
                }
            }
        }
    }
}