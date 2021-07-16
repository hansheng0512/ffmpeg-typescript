import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SafeUrlPipe } from "./safe-resources-url.pipe";

@NgModule({
  declarations: [SafeUrlPipe],
  imports: [CommonModule],
  exports: [SafeUrlPipe],
  providers: [],
})
export class SharedModule {}
