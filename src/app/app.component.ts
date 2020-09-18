import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PDFJSStatic, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import * as  PDFJS from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

declare global {
  const PDFJS: PDFJSStatic;
}

interface ICanvasWorkspace {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
}

class NodeCanvasFactory {
  create(width: number, height: number): ICanvasWorkspace {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    return {
      canvas,
      context,
    };
  }

  reset(workspace: ICanvasWorkspace, width: number, height: number) {
    workspace.canvas.width = width;
    workspace.canvas.height = height;
  }

  destroy(workspace: ICanvasWorkspace) {
    workspace.canvas.width = 0;
    workspace.canvas.height = 0;
    workspace.canvas.remove();
    workspace.context = null;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('holder', { static: true }) holder: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  pdfurl = 'assets/demo.pdf';
  result: any;
  imgURL: string;
  ngOnInit() {

    this.imgURL = "assets/download.jpg";
    console.log("Working", PDFJS);
    this.renderPDF();

  }


  renderPDF() {
    PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    PDFJS.getDocument(this.pdfurl).promise.then((pdf: PDFDocumentProxy) => {
      this.renderDoc(pdf);
    })
  }

  renderDoc(pdfDoc) {
    for (var num = 1; num <= pdfDoc.numPages; num++)
      pdfDoc.getPage(num).then((page) => {
        this.renderPage(page);
      });
  }

  renderPage(page) {
    console.log("renderPage", page._pageIndex);
    var viewport = page.getViewport({ scale: 1 });
    var wrapper = document.createElement("div");
    wrapper.className = "canvas-wrapper";
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    wrapper.appendChild(canvas)
    //this.holder.nativeElement.appendChild(wrapper);
    page.render(renderContext).promise.then(() => {
      console.log("renderContext", renderContext)
      this.result = canvas.toDataURL('image/jpeg');

      console.log("result", this.result)
    });

  }

  // private loadImageFile(file: File) {
  //   const fileReader = new FileReader();
  //   const imageType = file.type;
  //   console.log("imageType", imageType)
  //   if (PDFJS && imageType === 'application/pdf') {
  //     PDFJS.getDocument({ url: this.pdfurl }).then((pdf: PDFDocumentProxy) => {
  //       pdf.getPage(1).then((page: PDFPageProxy) => {
  //         const viewport = page.getViewport({ scale: 1 });
  //         const canvasFactory = new NodeCanvasFactory();
  //         const workspace = canvasFactory.create(viewport.width, viewport.height);
  //         const renderContext = {
  //           canvasContext: workspace.context || new CanvasRenderingContext2D(),
  //           viewport: viewport,
  //           canvasFactory: canvasFactory,
  //         };
  //         const result = workspace.canvas.toDataURL('image/jpeg');
  //       })
  //     })
  //   }

  // }

}
