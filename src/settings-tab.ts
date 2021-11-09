/*
 * @Author: Creling
 * @Date: 2021-07-15 23:54:03
 * @LastEditors: zzz
 * @LastEditTime: 2021-11-09 22:35:28
 * @Description: file content
 */
import {
    App,
    PluginSettingTab,
    Setting,
} from 'obsidian';

import ImageUploader from './main'

export default class ImageUploaderSettingTab extends PluginSettingTab {
    plugin: ImageUploader;
    constructor(app: App, plugin: ImageUploader) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl("h3", { text: "Chevereto Setting" });

        new Setting(containerEl)
            .setName("Api Endpoint")
            .setDesc("The endpoint of the image hosting api.")
            .addText((text) => {
                text
                    .setPlaceholder("")
                    .setValue(this.plugin.settings.apiEndpoint)
                    .onChange(async (value) => {
                        this.plugin.settings.apiEndpoint = value;
                        await this.plugin.saveSettings();
                    })
            }
            );

        new Setting(containerEl)
            .setName("Chevereto API Token")
            .setDesc("the API token of the chevereto.")
            .addTextArea((text) => {
                text
                    .setPlaceholder("")
                    .setValue(this.plugin.settings.token)
                    .onChange(async (value) => {
                        try {
                            this.plugin.settings.token = value;
                            await this.plugin.saveSettings();
                        }
                        catch (e) {
                            console.log(e)
                        }
                    })
            });

        new Setting(containerEl)
            .setName("Enable Resize")
            .setDesc("Resize the image before uploading")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.enableResize)
                    .onChange(async (value) => {
                        this.plugin.settings.enableResize = value;
                        this.display();
                    })
            })

        if (this.plugin.settings.enableResize) {
            new Setting(containerEl)
                .setName("Max Width")
                .setDesc("The image wider than this will be resized by the natural aspect ratio")
                .addText((text) => {
                    text
                        .setPlaceholder("")
                        .setValue(this.plugin.settings.maxWidth.toString())
                        .onChange(async (value) => {
                            this.plugin.settings.maxWidth = parseInt(value);
                            await this.plugin.saveSettings();
                        })
                });
        }
    }
}