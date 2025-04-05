import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'markdown',
    standalone: true
})
export class MarkdownPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    }

    async transform(value: string): Promise<SafeHtml> {
        if (!value) return from(['']);

        const html = await marked(value);
        console.log("🚀 ~ MarkdownPipe ~ transform ~ value:", value)
        return this.sanitizer.bypassSecurityTrustHtml(html)
    }
} 