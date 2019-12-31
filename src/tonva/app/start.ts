import { AppConfig, CAppBase } from './CAppBase';

export async function start(CApp: new (config: AppConfig) => CAppBase, appConfig: AppConfig) {
    let html = document.getElementsByTagName('html');
    let version = html[0].getAttribute('data-version');
    if (version) appConfig.version = version;
    let cApp = new CApp(appConfig);
    await cApp.start();
}
