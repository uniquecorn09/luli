import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  imports: [MatGridListModule, MatCardModule, MatButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  feedStatus: string = '';

  constructor(private http: HttpClient) {}

  updateFeed() {
    this.feedStatus = 'Batch loading...';
    const eventSource = new EventSource(
      environment.apiBaseUrl + '/settings/update-feed-stream'
    );
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        this.feedStatus = 'Fehler: ' + data.error;
        eventSource.close();
      } else if (data.done) {
        this.feedStatus =
          'Import erfolgreich (' + data.upserted + ' neue Produkte)';
        eventSource.close();
      } else {
        this.feedStatus = `Batch ${data.page}: +${data.batchUpserted} (gesamt: ${data.upserted})`;
      }
    };
    eventSource.onerror = () => {
      this.feedStatus = 'Fehler beim Import!';
      eventSource.close();
    };
  }
}
