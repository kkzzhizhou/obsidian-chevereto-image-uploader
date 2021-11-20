import {
  Notice,
  Plugin,
  MarkdownView,
  Editor,
} from "obsidian";

import axios from "axios"
import objectPath from 'object-path'
import ImageUploaderSettingTab from './settings-tab'
import Compressor from 'compressorjs'
interface ImageUploaderSettings {
  apiEndpoint: string;
  token: string;
  maxWidth: number;
  enableResize: boolean;
}

const DEFAULT_SETTINGS: ImageUploaderSettings = {
  apiEndpoint: null,
  token: null,
  maxWidth: 4096,
  enableResize: false,
};

type Handlers = {
  drop: (cm: CodeMirror.Editor, event: DragEvent) => void;
  paste: (cm: CodeMirror.Editor, event: ClipboardEvent) => void;
};

async function readFileAsDataURL(file) {
  let result_base64 = await new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.onload = (e) => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

  return result_base64;
}

export default class ImageUploader extends Plugin {
  settings: ImageUploaderSettings;


  private cmAndHandlersMap = new Map<CodeMirror.Editor, Handlers>();

  private getEditor() {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (mdView) {
      return mdView.editor;
    } else {
      return null;
    }
  }

  private backupOriginalHandlers(cm: CodeMirror.Editor) {
    if (!this.cmAndHandlersMap.has(cm)) {
      this.cmAndHandlersMap.set(cm, {
        drop: (cm as any)._handlers.drop[0],
        paste: (cm as any)._handlers.paste[0],
      });
    }
    return this.cmAndHandlersMap.get(cm);
  }

  setupPasteHandler(): void {
    this.registerCodeMirror((cm: any) => {
      const originalPasterHandler = this.backupOriginalHandlers(cm);
      cm._handlers.paste[0] = async (_: any, e: ClipboardEvent) => {
        const { files } = e.clipboardData;
        // console.log(files)
        if (files.length == 0 || !files[0].type.startsWith("image")) {
          originalPasterHandler.paste(_, e)
        }
        else if (this.settings.apiEndpoint && this.settings.token) {
          for (let file of files) {
            const randomString = (Math.random() * 10086).toString(36).substr(0, 8)
            const pastePlaceText = `![uploading...](${randomString})\n`
            this.getEditor().replaceSelection(pastePlaceText)
            const maxWidth = this.settings.maxWidth
            if (this.settings.enableResize) {
              const compressedFile = await new Promise((resolve, reject) => {
                new Compressor(file, {
                  maxWidth: maxWidth,
                  success: resolve,
                  error: reject,
                })
              })

              file = compressedFile as File
            }
            const params = new URLSearchParams();
            params.append('key', this.settings.token);
            let dataURL = await readFileAsDataURL(file)
            const source = JSON.stringify(dataURL).split(',')[1].split('"')[0]
            params.append('source', source)
            axios.post(this.settings.apiEndpoint, params)
              .then(res => {
                const url = objectPath.get(res.data, 'image.url')
                const imgMarkdownText = `![](${url})`
                this.replaceText(this.getEditor(), pastePlaceText, imgMarkdownText)
              }, err => {
                new Notice(err, 5000)
                // console.log(err)
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                const newEvt = new ClipboardEvent("paste", {
                  clipboardData: dataTransfer
                })
                originalPasterHandler.paste(_, newEvt)
              })
          }
        }
        else {
          new Notice("Chevereto Image Uploader: Please check the chevereto settings.");
          originalPasterHandler.paste(_, e);
        }
      }
    })
  }

  private replaceText(editor: Editor, target: string, replacement: string): void {
    target = target.trim()
    const lines = editor.getValue().split("\n");
    for (let i = 0; i < lines.length; i++) {
      const ch = lines[i].indexOf(target)
      if (ch !== -1) {
        const from = { line: i, ch };
        const to = { line: i, ch: ch + target.length };
        editor.replaceRange(replacement, from, to);
        break;
      }
    }
  }

  async onload(): Promise<void> {
    // console.log("loading Image Uploader");
    await this.loadSettings();
    this.setupPasteHandler()
    this.addSettingTab(new ImageUploaderSettingTab(this.app, this));
  }

  onunload(): void {
    this.cmAndHandlersMap.forEach((hander, cm) => {
      (cm as any)._handlers.paste[0] = hander.paste;
    })
    // console.log("unloading Image Uploader");

  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
