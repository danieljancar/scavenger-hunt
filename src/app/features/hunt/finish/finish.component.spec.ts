import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { FinishComponent } from './finish.component'

describe('FinishComponent', () => {
    let component: FinishComponent
    let fixture: ComponentFixture<FinishComponent>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FinishComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents()

        fixture = TestBed.createComponent(FinishComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    }))

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
