import * as React from 'react';

import { DiagramView } from '../diagram/view';
import { formatLocalizedLabel, chooseLocalizedText } from '../diagram/model';
import { ElementModel, ElementTypeIri, LocalizedString, PropertyTypeIri } from '../data/model';

const CLASS_NAME = 'ontodia-edit-form';

export interface Props {
    view: DiagramView;
    entity: ElementModel;
    elementTypes?: ReadonlyArray<ElementTypeIri>;
    onApply: (entity: ElementModel) => void;
    onCancel: () => void;
}

export interface State {
    elementModel?: ElementModel;
}

export class EditEntityForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {elementModel: props.entity};
    }

    private renderProperty = (key: PropertyTypeIri, values: LocalizedString[]) => {
        const {view} = this.props;
        const property = view.model.getProperty(key);
        const label = formatLocalizedLabel(key, property.label, view.getLanguage());

        return (
            <div key={key} className={`${CLASS_NAME}__form-row`}>
                <label>
                    {label}
                    {
                        values.map((value, index) => (
                            <input key={index} className='ontodia-form-control' defaultValue={value.text} />
                        ))
                    }
                </label>
            </div>
        );
    }

    private renderProperties() {
        const {properties} = this.props.entity;

        return (
            <div>
                {
                    Object.keys(properties).map((key: PropertyTypeIri) => {
                        const {values} = properties[key];
                        return this.renderProperty(key, values);
                    })
                }
            </div>
        );
    }

    onChangeType = (e: React.FormEvent<HTMLSelectElement>) => {
        const target = (e.target as HTMLSelectElement);
        const {elementModel} = this.state;
        this.setState({elementModel: {...elementModel, types: [target.value as ElementTypeIri]}});
    }

    private renderType() {
        const {view, elementTypes} = this.props;
        const {elementModel} = this.state;

        let control: React.ReactElement<HTMLSelectElement | HTMLInputElement>;

        if (elementTypes) {
            control = (
                <select className='ontodia-form-control' value={elementModel.types[0]} onChange={this.onChangeType}>
                    <option value='' disabled={true}>Select link type</option>
                    {
                        elementTypes.map(elementType => {
                            const type = view.model.createClass(elementType);
                            const label = view.getElementTypeLabel(type).text;
                            return <option key={elementType} value={elementType}>{label}</option>;
                        })
                    }
                </select>
            );
        } else {
            const label = view.getElementTypeString(elementModel);
            control = (
                <input className='ontodia-form-control' value={label} disabled={true} />
            );
        }

        return (
            <label>
                Type
                {control}
            </label>
        );
    }

    private onChangeLabel = (e: React.FormEvent<HTMLInputElement>) => {
        const target = (e.target as HTMLInputElement);

        const {elementModel} = this.state;
        const label = {values: [{text: target.value, lang: ''}]};

        this.setState({elementModel: {...elementModel, label}});
    }

    private renderLabel() {
        const {view} = this.props;
        const label = chooseLocalizedText(this.state.elementModel.label.values, view.getLanguage()).text;

        return (
            <label>
                Label
                <input className='ontodia-form-control' value={label} onChange={this.onChangeLabel} />
            </label>
        );
    }

    render() {
        return (
            <div className={CLASS_NAME}>
                <div className={`${CLASS_NAME}__body`}>
                    <div className={`${CLASS_NAME}__form-row`}>
                        {this.renderType()}
                    </div>
                    <div className={`${CLASS_NAME}__form-row`}>
                        {this.renderLabel()}
                    </div>
                    {this.renderProperties()}
                </div>
                <div className={`${CLASS_NAME}__controls`}>
                    <button className={`ontodia-btn ontodia-btn-success ${CLASS_NAME}__apply-button`}
                        onClick={() => this.props.onApply(this.state.elementModel)}>
                        Apply
                    </button>
                    <button className='ontodia-btn ontodia-btn-danger'
                        onClick={this.props.onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}
