import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FileValidators {


  static maxFileSize(maxSizeMB: number) {
    const maxSize = maxSizeMB * 1024 * 1024; // MB → Bytes
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (file) {
        if (file.size > maxSize) {
          return { maxFileSize: { requiredSize: maxSizeMB } };
        }
      }
      return null;
    };
  }


  static allowedExtensions(extensions: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (file) {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!extensions.includes(ext)) {
          return { allowedExtensions: { extensions } };
        }
      }
      return null;
    };
  }
}
