import * as vscode from "vscode";
import { RadioStation } from "./types";
import { RADIO_STATIONS } from "./stations";

// TODO get images?
// TODO add like a bars going up and down? but seems a bit heavy
// TODO Show song title, artist, and album art in your Webview header.

function getWebviewContent(station: RadioStation): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; media-src *; style-src 'unsafe-inline';"
      >
      <title>${station.label}</title>
    </head>
    <body style="margin:0;padding:1em;font-family:sans-serif;">
      <h2>🎧 Now Playing: ${station.label}</h2>
      <audio controls autoplay style="width:100%;">
        <source src="${station.stream}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </body>
    </html>
  `;
}

function createRadio(station: RadioStation | undefined) {
  const panel = vscode.window.createWebviewPanel(
    "sgRadio",
    "SG Radio Player",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      // keep the DOM alive (and audio playing) even when hidden
      retainContextWhenHidden: true,
    },
  );
  // don't think this will ever happen, but here for safety
  if (!station) {
    station = RADIO_STATIONS[Math.floor(Math.random() * RADIO_STATIONS.length)];
  }

  panel.webview.html = getWebviewContent(station);
}

export function activate(context: vscode.ExtensionContext) {
  const launchRadioCommand = vscode.commands.registerCommand(
    "vscode-sg-radio.start",
    async () => {
      const station = await vscode.window.showQuickPick(RADIO_STATIONS);
      createRadio(station);
    },
  );

  context.subscriptions.push(launchRadioCommand);
}

export function deactivate() {}
