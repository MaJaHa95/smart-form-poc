import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LuxonDateAdapter, MatLuxonDateModule } from "@angular/material-luxon-adapter";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { DateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroductionBottomSheetComponent } from './bottom-sheets/introduction-bottom-sheet/introduction-bottom-sheet.component';
import { ImageMapComponent } from './components/image-map/image-map.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageSectionHighlightComponent } from './components/image-section-highlight/image-section-highlight.component';
import { LotNumberHelpBottomSheetComponent } from './bottom-sheets/lot-number-help-bottom-sheet/lot-number-help-bottom-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageUploadComponent,
    ImageMapComponent,
    IntroductionBottomSheetComponent,
    ImageSectionHighlightComponent,
    LotNumberHelpBottomSheetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatStepperModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatExpansionModule,
    MatIconModule,
    MatBottomSheetModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
