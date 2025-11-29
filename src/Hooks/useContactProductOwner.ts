import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { baseURL } from "../Constants/BaseUrls";

type ContactResponse = {
  message: string;
  success: boolean;
  chatDetails: {
    sender: {
      userId: string;
      mobileNumber: string;
    };
    receiver: {
      userId: string;
      mobileNumber: string;
    };
    whatsappUrl: string;
  };
};

export function useContactProductOwner() {
  return useMutation<ContactResponse, unknown, string>({
    mutationFn: async (productId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `h${baseURL}/products/contact/${productId}`,
        {
          headers: { authentication: `bearer ${token}` },
        }
      );
      return response.data as ContactResponse;
    },
  });
}
