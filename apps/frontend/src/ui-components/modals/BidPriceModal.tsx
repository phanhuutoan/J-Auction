import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface BidPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  price: number;
};
function BidPriceModal(props: BidPriceModalProps) {
  const { isOpen, onClose } = props;
  const { register, handleSubmit } = useForm<FormData>();

  function _onSubmit(data: FormData) {
    console.log("Data", data);
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter bid price</ModalHeader>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Your bid price</FormLabel>
              <Input type="number" {...register("price")} required />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" onClick={onClose}>
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default BidPriceModal;
