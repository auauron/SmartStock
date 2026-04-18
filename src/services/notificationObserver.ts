export type NotificationUpdateReason =
  | "inventory-changed"
  | "preferences-changed"
  | "manual-refresh";

export interface NotificationObserver {
  update(reason: NotificationUpdateReason): void;
}

export interface NotificationSubject {
  subscribe(observer: NotificationObserver): () => void;
  unsubscribe(observer: NotificationObserver): void;
  notify(reason: NotificationUpdateReason): void;
}

class NotificationUpdateSubject implements NotificationSubject {
  private observers = new Set<NotificationObserver>();

  subscribe(observer: NotificationObserver): () => void {
    this.observers.add(observer);
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer: NotificationObserver): void {
    this.observers.delete(observer);
  }

  notify(reason: NotificationUpdateReason): void {
    for (const observer of this.observers) {
      observer.update(reason);
    }
  }
}

export const notificationSubject = new NotificationUpdateSubject();
