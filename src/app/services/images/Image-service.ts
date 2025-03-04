import { Injectable } from '@angular/core';
import { ContextService } from '../context/context.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private contextService: ContextService) {}

  getProductImageUrl(imgUrl: string | undefined): string | undefined {
    if(imgUrl === null){
      return undefined
    }
    return imgUrl && imgUrl !== 'OWN' ? imgUrl : this.contextService.getDefaultProductImgUrl();
  }
}
