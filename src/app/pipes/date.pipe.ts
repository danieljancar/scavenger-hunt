import { Pipe, PipeTransform } from '@angular/core';
import { HuntTime } from '../types/hunt.types';

@Pipe({
  standalone: true,
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  transform(
    value: Date | string | HuntTime | null,
    format: 'relative' | 'normal' | 'time' | 'huntTime',
  ): string {
    if (value === null) {
      return '';
    }

    if (typeof value === 'string' || value instanceof Date) {
      const date = typeof value === 'string' ? new Date(value) : value;
      return this.formatDate(date, format);
    } else if (value && 'start' in value && 'end' in value) {
      if (value?.start && value?.end) {
        return this.calculateDuration(value.start, value.end);
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  private formatDate(
    date: Date,
    format: 'relative' | 'normal' | 'time' | 'huntTime',
  ): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (format === 'relative') {
      if (seconds < 60) {
        return 'Just now';
      } else if (minutes === 1) {
        return '1 min ago';
      } else if (minutes < 60) {
        return `${minutes} mins ago`;
      } else if (hours === 1) {
        return '1h ago';
      } else if (hours < 24) {
        return `${hours} hs ago`;
      } else if (days === 1) {
        return 'Yesterday';
      } else if (days < 7) {
        return `${days}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } else if (format === 'normal') {
      return date.toLocaleDateString();
    } else if (format === 'time') {
      return date.toLocaleTimeString();
    } else {
      return '';
    }
  }

  private calculateDuration(
    startTime: Date | string,
    endTime: Date | string,
  ): string {
    const startDate =
      typeof startTime === 'string' ? new Date(startTime) : startTime;
    const endDate = typeof endTime === 'string' ? new Date(endTime) : endTime;

    const duration = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    return `${this.formatDigit(hours)}:${this.formatDigit(minutes)}:${this.formatDigit(seconds)}`;
  }

  private formatDigit(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
