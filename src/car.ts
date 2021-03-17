/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { Object, Property } from 'fabric-contract-api';
@Object()
export class Car {

  @Property()
    public id: string = '';

    @Property()
    public weight?: number;

    @Property()
    public producerId: string = '';

    //@Property()
    //public date: Date;
    // let's create the date with the transaction automatically (CreateBatchEvents)
    
    @Property()
    public docType?: string;
    
    @Property()
    public certification?: string[];
  }
