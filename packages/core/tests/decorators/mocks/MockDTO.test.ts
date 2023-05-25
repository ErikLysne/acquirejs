import acquireMockDataStorage from "@/classes/AcquireMockDataStorage.class";
import Mock from "@/decorators/mocks/Mock.decorator";
import MockDTO from "@/decorators/mocks/MockDTO.decorator";
import generateMock from "@/functions/generateMock.function";
import Chance from "chance";

const chance = new Chance();

describe("decorator: MockDTO", () => {
  beforeEach(() => {
    acquireMockDataStorage.clearAll();
  });

  it("should create a mock object from the mock decorator, using the decorators of the target class", async () => {
    class GeoDTO {
      @Mock(chance.longitude()) lng: number;
      @Mock(chance.latitude()) lat: number;
    }

    class AddressDTO {
      @Mock(chance.country()) country: string;
      @Mock(chance.city()) city: string;
      @Mock(chance.zip()) zipCode: string;
      @Mock(chance.street()) street: string;
      @MockDTO(() => GeoDTO) geo: GeoDTO;
    }

    class UserDTO {
      @MockDTO(() => AddressDTO) address: AddressDTO;
    }

    const user = await generateMock(UserDTO);

    expect(user.address).toBeDefined();
    expect(user.address.country).toBeDefined();
    expect(user.address.city).toBeDefined();
    expect(user.address.zipCode).toBeDefined();
    expect(user.address.street).toBeDefined();
  });

  it("should work with deeply nested objects", async () => {
    class GeoDTO {
      @Mock(chance.longitude()) lng: number;
      @Mock(chance.latitude()) lat: number;
    }

    class AddressDTO {
      @Mock(chance.country()) country: string;
      @Mock(chance.city()) city: string;
      @Mock(chance.zip()) zipCode: string;
      @Mock(chance.street()) street: string;
      @MockDTO(() => GeoDTO) geo: GeoDTO;
    }

    class UserDTO {
      @MockDTO(() => AddressDTO) address: AddressDTO;
    }

    const user = await generateMock(UserDTO);

    expect(user.address).toBeDefined();
    expect(user.address.geo).toBeDefined();
    expect(user.address.geo.lng).toBeDefined();
    expect(user.address.geo.lat).toBeDefined();
  });
});
