use std::collections::HashMap;
use std::net::SocketAddrV4;
use std::str::FromStr;

use serde::{Serialize, Deserialize};
use xjbutil::minhttpd::MinHttpd;
use xjbutil::minhttpd::HttpLogLevel;
use xjbutil::minhttpd::HttpResponse;


#[derive(Serialize, Deserialize)]
#[serde(rename_all="camelCase")]
struct ModuleDescriptor {
    formal_name: String,
    version: String,
    game_version: String,
    name: HashMap<String, String>,
    description: HashMap<String, String>
}

#[derive(Serialize, Deserialize)]
struct ModuleInfo {
    entry: String,
    descriptor: ModuleDescriptor
}

fn log_http_request(log_level: HttpLogLevel, info: &str) {
    match log_level {
        HttpLogLevel::Debug => log::debug!("{}", info),
        HttpLogLevel::Info => log::info!("{}", info),
        HttpLogLevel::Warn => log::warn!("{}", info),
        HttpLogLevel::Error => log::error!("{}", info)
    }
}

fn main() {
    let server_descriptor = "server=1
name=rs705
lang=rust
version=0.1.0
caps=probe,module,save";

    if std::env::var("RUST_LOG").is_err() {
        std::env::set_var("RUST_LOG", "info");
    }
    env_logger::init();

    let mut minhttpd = MinHttpd::with_logger(log_http_request);

    minhttpd.route_static(
        "/api/probe",
        "text/plain; charset=utf-8",
        server_descriptor.to_string()
    );

    minhttpd.route_fn(
        "/api/module/list",
        |_, _, _, _| {
            let mut modules = Vec::new();
            for entry in std::fs::read_dir("mod")? {
                let Ok(entry) = entry else {
                    continue;
                };
                let path = entry.path();
                
                if path.is_dir() {
                    let descriptor_path = path.join("mod.json");
                    let index_path = path.join("index.js");
                    if index_path.exists() && descriptor_path.exists() {
                        let Ok(descriptor) = std::fs::read_to_string(descriptor_path) else {
                            continue;
                        };

                        let Ok(descriptor) = serde_json::from_str::<ModuleDescriptor>(&descriptor) else {
                            continue;
                        };

                        modules.push(ModuleInfo {
                            entry: path.file_name()
                                .ok_or("无法获取文件名")?
                                .to_str()
                                .ok_or("无法将文件名转换为有效的 UTF-8 序列")?
                                .to_string(),
                            descriptor
                        });
                    }
                }
            }

            Ok(HttpResponse::new(
                200,
                vec![("Content-Type".to_string(), "application/json; charset=utf-8".to_string())],
                Some(serde_json::to_string(&modules)?)
            ))
        }
    );

    log::info!("在 http://127.0.0.1:3000 启动了服务器");
    minhttpd.serve(SocketAddrV4::from_str("127.0.0.1:3000").unwrap()).unwrap();
}
