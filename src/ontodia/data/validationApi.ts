import { CancellationToken } from '../viewUtils/async';
import { ElementModel, LinkModel, LinkTypeIri, PropertyTypeIri } from './model';
import { AuthoringState } from '../editor/authoringState';

export interface ElementError {
    message: string;
    relationIri: LinkTypeIri | PropertyTypeIri;
}

export interface LinkError {
    message: string;
}

export interface ValidationApi {
    /**
     * Validates element model
     */
    validateElement(element: ElementModel, state: AuthoringState, ct: CancellationToken): Promise<ElementError[]>;

    /**
     * Validates link model
     */
    validateLink(
        link: LinkModel, source: ElementModel, target: ElementModel, ct: CancellationToken
    ): Promise<LinkError[]>;
}
