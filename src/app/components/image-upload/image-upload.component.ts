import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

interface IFileWithPreview {
  file: File;
  previewUrl?: string;
}

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements ControlValueAccessor {
  @Input()
  text = "Upload an image"

  disabled = false;

  images: IFileWithPreview[] = [];

  private onChange: (images: File[]) => void = () => { };
  private onTouched = () => { };

  onFile(files: FileList) {
    const images = [...this.images];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) {
        continue;
      }

      const item: IFileWithPreview = {
        file
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        item.previewUrl = e.target?.result as string;
      };

      reader.readAsDataURL(file);

      images.push(item);
    }

    this.images = images;

    this.onChange(images.map(c => c.file));
  }

  removeImage(file: IFileWithPreview) {
    this.images = this.images.filter(c => c !== file);

    this.onChange(this.images.map(c => c.file));
  }

  openFilePicker(input: HTMLInputElement) {
    this.onTouched();

    input.click();
  }

  writeValue(obj: any): void {
    this.images = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
