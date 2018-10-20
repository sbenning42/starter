import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-store-creator',
  templateUrl: './store-creator.component.html',
  styleUrls: ['./store-creator.component.css']
})
export class StoreCreatorComponent implements OnInit {

  lastCreatedStore = '';

  storeForm: FormGroup;
  stateName: FormControl = new FormControl('', [Validators.required]);
  stateModel: FormControl = new FormControl('', [Validators.required]);
  actionName: FormControl = new FormControl('', []);

  actions: FormArray = new FormArray([]);

  typeDescs = [
    {value: 'Action', viewValue: 'Action'},
    {value: 'ZtoAction', viewValue: 'Zto Action'},
    {value: 'ZtoAction', viewValue: 'Zto Command'},
    {value: 'ZtoAction', viewValue: 'Zto Event'},
    {value: 'ZtoRequest', viewValue: 'Zto Request'},
    {value: 'ZtoReply', viewValue: 'Zto Reply'},
    {value: 'ZtoSequence', viewValue: 'Zto Sequence'},
    {value: 'ZtoSequenced', viewValue: 'Zto Sequenced'},
  ];

  constructor() {
    this.storeForm = new FormGroup({
      stateName: this.stateName,
      stateModel: this.stateModel,
      actionName: this.actionName,
      actions: this.actions,
    });
  }

  ngOnInit() {
  }

  addAction() {
    this.actions.insert(0, new FormGroup({
      name: new FormControl(this.actionName.value, [Validators.required]),
      type: new FormControl('', [Validators.required]),
      payload: new FormControl('', [Validators.required]),
    }));
    this.actionName.setValue('');
  }

  generate() {
    const state = this.stateName.value;
    const model = this.stateModel.value;
    const actions = this.actions.value;
    this.storeForm.reset();
    this.lastCreatedStore = schematic(state, model, actions);
    console.log('Created: ', this.lastCreatedStore);
  }

}

function schematic(state: any, model: any, actions: any[]): string {
  const stateName = `${state}State`;
  const stateTpl = `
export interface ${stateName} ${model.replace(/,/g, ';')}
export const initial${stateName}: ${stateName} = ${model.replace(/: [^:]*?,/g, ': undefined,')};
  `;
  const actionsTpl = `
export enum ${state}ActionTypes {
  ${
    actions.reduce((acc, act) => acc
      ? `${acc}\n\t${act.name} = '[${state}] ${act.name}',`
      : `\t${act.name} = '[${state}] ${act.name}',`,
    '')
  }
}
${
  actions.reduce((acc, act) => acc
    ? `${acc}\nexport class ${state}${act.name} extends ${act.type} {
      constructor(${act.payload
        ? `public payload: ${act.payload}${act.type === 'ZtoReply' || act.type === 'ZtoSequenced' ? `, action: ZtoAction` : ''}`
        : ''
      }) {
        super(${state}ActionTypes.${act.name}${act.type === 'ZtoReply' || act.type === 'ZtoSequenced' ? `, action` : ''});
      }
    }`
    : `export class ${state}${act.name} extends ${act.type} {
      constructor(${act.payload
        ? `public payload: ${act.payload}${act.type === 'ZtoReply' || act.type === 'ZtoSequenced' ? `, action: ZtoAction` : ''}`
        : ''
      }) {
        super(${state}ActionTypes.${act.name}${act.type === 'ZtoReply' || act.type === 'ZtoSequenced' ? `, action` : ''});
      }
    }`,
  '')
}
export type ${state}Actions = ${
  actions.reduce((acc, act) => acc
    ? `${acc}\n|${state}${act.name}`
    : `${state}${act.name}`,
  '')
};
  `;
  const reducerTpl = `
export function ${stateName}Reducer(state: ${stateName} = initial${stateName}, typedAction: ${state}Actions): ${stateName} {
  switch (action.type) {
    ${
      actions.reduce((acc, act) => acc
        ? `${acc}\n\tcase ${state}ActionTypes.${act.name}: /*{
          const action = typedAction as ${state}${act.name};
          return {
            ...state,
          };
        }*/`
        : `case ${state}ActionTypes.${act.name}: /*{
          const action = typedAction as ${state}${act.name};
          return {
            ...state,
          };
        }*/`,
      '')
    }
    default:
      return state;
  }
}
  `;
  const effectsTpl = `
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class ${state}Effects {
  constructor(
    public actions$: Actions,
    public ${state}: ${state}Facade,
    public store: Store<any>,
  ) {}
  @Effect({dispatch: false})
  log = this.actions$.pipe(
    filter((action: Action) => action.type.search('[${state}] ') !== -1),
    tap((action: ${state}Actions) => console.log('${state}Effects@log: ', action))
  );
}
  `;
  const facadeTpl = `
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class ${state}Facade {
  constructor(private store: Store<any>) {}
}
  `;
  const template = `
// STATE TEMPLATE:
${stateTpl}

/**************************************************************************/

// ACTIONS TEMPLATE:
${actionsTpl}

/**************************************************************************/

// REDUCER TEMPLATE:
${reducerTpl}

/**************************************************************************/

// EFFECTS TEMPLATE:
${effectsTpl}

/**************************************************************************/

// FACADE TEMPLATE:
${facadeTpl}

`;
  return template;
}
