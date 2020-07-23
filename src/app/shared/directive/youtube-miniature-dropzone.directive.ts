import { Directive, ViewContainerRef, HostListener, HostBinding, EventEmitter, ElementRef } from "@angular/core";

@Directive({
    selector: '[appYouTubeMiniatureDropZone]'
})
export class YouTubeMiniatureDropzoneDirective {
    fileUrl: EventEmitter<string> = new EventEmitter();

    constructor(
        public viewContainerRef: ViewContainerRef
    ) {
    }

    @HostBinding('class.fileover') fileOver: boolean;

    @HostListener('dragover') public onDragOver() {
        event.stopPropagation();
        event.preventDefault();
        console.log('DRAGOVER');
        this.fileOver = true;
    }

    @HostListener('dragleave') public onDragLeave() {
        event.stopPropagation();
        event.preventDefault();
        console.log('DRAGLEAVE');
        this.fileOver = false;
    }

    @HostListener('drop', ['$event']) public onDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        console.log('DROP')
        this.fileOver = false;

        const imageUrl = event.dataTransfer.getData('text/html');

        const url = /src="?([^"\s]+)"?\s*/.exec(imageUrl)[1];
        console.log(url);
        this.fileUrl.emit(url);
    }
}