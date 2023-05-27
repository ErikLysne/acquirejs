import { Expose, ToNumber, Type } from "@acquire/core";

export class GeoModel {
  @Expose() @ToNumber(0) lat: number;
  @Expose() @ToNumber(0) lng: number;
}

export class AddresModel {
  @Expose() street: string;
  @Expose() suite: string;
  @Expose() city: string;
  @Expose() zipcode: string;
  @Expose() @Type(() => GeoModel) geo: GeoModel;
}

export class CompanyModel {
  @Expose() name: string;
  @Expose() catchPhrase: string;
  @Expose() bs: string;
}

export class UserModel {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() username: string;
  @Expose() email: string;
  @Expose() @Type(() => AddresModel) address: AddresModel;
  @Expose() phone: string;
  @Expose() website: string;
  @Expose() @Type(() => CompanyModel) company: CompanyModel;
}
