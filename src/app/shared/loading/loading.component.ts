import { Component, Input } from '@angular/core'
import { IonicModule } from '@ionic/angular'

/**
 * Loading component
 *
 * @example
 * <app-loading icon="dots" title="Loading" message="Please wait..."></app-loading>
 */
@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    imports: [IonicModule],
    standalone: true,
})
export class LoadingComponent {
    @Input() title: string | undefined
    @Input() message: string | undefined

    constructor() {}
}
