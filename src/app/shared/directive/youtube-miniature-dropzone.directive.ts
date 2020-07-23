import { Directive, ViewContainerRef, HostListener, HostBinding, EventEmitter, ElementRef, Output } from "@angular/core";

@Directive({
    selector: '[appYouTubeMiniatureDropZone]'
})
export class YouTubeMiniatureDropzoneDirective {
    @Output() isDragging: EventEmitter<boolean> = new EventEmitter();
    @Output() fileDropped: EventEmitter<string> = new EventEmitter();

    constructor(
        public viewContainerRef: ViewContainerRef
    ) {
    }

    @HostListener('dragover') public onDragOver() {
        event.stopPropagation();
        event.preventDefault();
        console.log('DRAGOVER');
        this.isDragging.emit(true);
    }

    @HostListener('dragleave') public onDragLeave() {
        event.stopPropagation();
        event.preventDefault();
        console.log('DRAGLEAVE');
        this.isDragging.emit(false);
    }

    @HostListener('drop', ['$event']) public onDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        console.log('DROP')

        const imageUrl = event.dataTransfer.getData('text/html');

        const url = /src="?([^"\s]+)"?\s*/.exec(imageUrl)[1];
        this.isDragging.emit(false);
        this.fileDropped.emit(url);
    }
}