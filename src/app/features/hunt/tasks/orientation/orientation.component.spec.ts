import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { OrientationComponent } from './orientation.component'

describe('OrientationComponent', () => {
    let component: OrientationComponent
    let fixture: ComponentFixture<OrientationComponent>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OrientationComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents()

        fixture = TestBed.createComponent(OrientationComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    }))

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
