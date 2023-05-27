import { MockDTO, MockID } from "@acquire/core";
import {
  MockAddress,
  MockCity,
  MockCompany,
  MockEmail,
  MockFirstName,
  MockLatitude,
  MockLongitude,
  MockName,
  MockParagraph,
  MockPhone,
  MockPostal,
  MockSentence,
  MockUrl,
  MockZip
} from "@acquire/mocks";

export class GeoDTO {
  @MockLatitude() lat?: string;
  @MockLongitude() lng?: string;
}

export class AddressDTO {
  @MockAddress() street: string;
  @MockPostal() suite: string;
  @MockCity() city: string;
  @MockZip() zipcode: string;
  @MockDTO(() => GeoDTO) geo: GeoDTO;
}

export class CompanyDTO {
  @MockCompany() name: string;
  @MockParagraph() catchPhrase: string;
  @MockSentence() bs: string;
}

export class UserDTO {
  @MockID() id: number;
  @MockName() name: string;
  @MockFirstName() username: string;
  @MockEmail() email: string;
  @MockDTO(() => AddressDTO) address: AddressDTO;
  @MockPhone() phone: string;
  @MockUrl() website: string;
  @MockDTO(() => CompanyDTO) company: CompanyDTO;
}
