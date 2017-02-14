import {
  DomSanitizationService
} from '@angular/platform-browser';

export class CustomDomSanitizer extends DomSanitizationService {
  sanitize(ctx, value) {
    return value;
  }

  bypassSecurityTrustHtml() { return null; }
  bypassSecurityTrustStyle() { return null; }
  bypassSecurityTrustScript() { return null; }
  bypassSecurityTrustUrl() { return null; }
  bypassSecurityTrustResourceUrl() { return null; }
}
