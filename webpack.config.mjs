import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default  {
    mode: "development",
    entry: "./src/client/client.js",
    devtool: "source-map",    
    output: {
        path: path.resolve(__dirname, "dist/client"),
        filename: "client.js"
    },
    devServer: {
        static: ["./static"],         
        port: 5000,
        client: { webSocketURL: "http://localhost:5050/ws" }
    },
    module: {
        rules: [
            { test: /\.handlebars$/, loader: "handlebars-loader" }
          ]
    },
    resolve: {
        alias: {
            "@templates": path.resolve(__dirname, "templates/client")
        }
    }
};
