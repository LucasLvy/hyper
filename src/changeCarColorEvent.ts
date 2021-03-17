/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { Object, Property } from 'fabric-contract-api';

// use an interface to share the definition with client code
export interface IChangeColorEvent {
  docType: string;
  id: string;
  certification: string;
  transactionDate: Date;
}

@Object()
export class ChangeColorEvent implements IChangeColorEvent {
  @Property()
  public docType: string;

  @Property()
  public id: string;

  @Property()
  public certification: string;

  // @Property()
  public transactionDate: Date;

  public constructor(id: string, certification: string, txDate: Date) {
    this.docType = 'changeColorEvent';
    this.id = id;
    this.certification = certification;
    this.transactionDate = txDate;
  }

}
