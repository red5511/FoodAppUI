import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateOnResize'
})
export class TruncateOnResizePipe implements PipeTransform {

  transform(value: string, limit: number = 25): string {
    let modifiedString = '';
    let start = 0;
    
    while (start < value.length) {
      // Find the next space after the limit to avoid cutting words
      let end = start + limit;
      if (end < value.length) {
        const spaceIndex = value.lastIndexOf(' ', end);
        if (spaceIndex > start) {
          end = spaceIndex; // Move end to the last space before hitting the limit
        }
      }
      // Append the line and move to the next chunk
      modifiedString += value.slice(start, end) + '<br>';
      start = end + 1; // Move to the next chunk, skipping the space
    }

    return modifiedString;
  }

}