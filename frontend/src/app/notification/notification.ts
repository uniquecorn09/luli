import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../services/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notifications"
        class="notification notification-{{ notification.type }}"
      >
        <div class="notification-content">
          <span class="notification-message">{{ notification.message }}</span>
          <button
            class="notification-close"
            (click)="removeNotification(notification.id)"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1300;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      }

      .notification {
        padding: 12px 16px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        border-left: 4px solid;
        animation: slideIn 0.3s ease-out;
        max-width: 100%;
      }

      .notification-success {
        background: #d4edda;
        border-color: #28a745;
        color: #155724;
      }

      .notification-error {
        background: #f8d7da;
        border-color: #dc3545;
        color: #721c24;
      }

      .notification-info {
        background: #d1ecf1;
        border-color: #17a2b8;
        color: #0c5460;
      }

      .notification-warning {
        background: #fff3cd;
        border-color: #ffc107;
        color: #856404;
      }

      .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .notification-message {
        flex: 1;
        font-weight: 500;
      }

      .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }

      .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class NotificationComponent {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  removeNotification(id: string) {
    this.notificationService.remove(id);
  }
}
