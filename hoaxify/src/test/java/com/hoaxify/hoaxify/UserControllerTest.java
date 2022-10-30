package com.hoaxify.hoaxify;

import com.hoaxify.hoaxify.error.ApiError;
import com.hoaxify.hoaxify.shared.GenericResponse;
import com.hoaxify.hoaxify.user.User;
import com.hoaxify.hoaxify.user.UserRepository;
import com.hoaxify.hoaxify.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.hoaxify.hoaxify.TestUtil.createValidUser;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
// Charge l'application et démarre un web server
@ActiveProfiles("test")
public class UserControllerTest {

    public static final String API_V_1_0_USERS = "/api/v1.0/users";
    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @BeforeEach
    public void cleanup() {
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    @Test
    public void postUser_whenUserIsValid_receiveOk() {
        User user = createValidUser();
        ResponseEntity<Object> response =
                testRestTemplate.postForEntity(API_V_1_0_USERS, user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postUser_whenUserIsValid_userSavedToDB() {
        User user = createValidUser();
        postSignup(user, Object.class);
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    public void postUser_whenUserIsValid_receiveSuccessMessage() {
        User user = createValidUser();
        ResponseEntity<GenericResponse> response = postSignup(user, GenericResponse.class);
        assertThat(response.getBody().getMessage()).isNotNull();
    }

    @Test
    public void postUser_whenUserIsValid_pwdIsHashedInDB() {
        User user = createValidUser();
        postSignup(user, Object.class);
        List<User> users = userRepository.findAll();
        User inDB = users.get(0);
        assertThat(inDB.getPassword()).isNotEqualTo(user.getPassword());
    }

    @Test
    public void postUser_whenUserHasNullUsername_receiveBadRequest() {
        User user = createValidUser();
        user.setUsername(null);
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserHasNullDisplayName_receiveBadRequest() {
        User user = createValidUser();
        user.setDisplayName(null);
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserHasNullPassword_receiveBadRequest() {
        User user = createValidUser();
        user.setPassword(null);
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserHasUsernameWithLessThanRequired_receiveBadRequest() {
        User user = createValidUser();
        user.setUsername("abc");
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserHasDisplayNameWithLessThanRequired_receiveBadRequest() {
        User user = createValidUser();
        user.setDisplayName("abc");
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserHasPasswordWithLessThanRequired_receiveBadRequest() {
        User user = createValidUser();
        user.setPassword("P4sswd");
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserUsernameExceedsTheLengthLimit_receiveBadRequest() {
        User user = createValidUser();
        String valueOf256Chars = IntStream.rangeClosed(1, 256).mapToObj(x -> "a").collect(Collectors.joining());
        user.setUsername(valueOf256Chars);
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserDisplayNameExceedsTheLengthLimit_receiveBadRequest() {
        User user = createValidUser();
        String valueOf256Chars = IntStream.rangeClosed(1, 256).mapToObj(x -> "a").collect(Collectors.joining());
        user.setDisplayName(valueOf256Chars);
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserPasswordExceedsTheLengthLimit_receiveBadRequest() {
        User user = createValidUser();
        String valueOf256Chars = IntStream.rangeClosed(1, 256).mapToObj(x -> "a").collect(Collectors.joining());
        user.setPassword(valueOf256Chars + "A1");
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserPasswordWithAllLowerCase_receiveBadRequest() {
        User user = createValidUser();
        user.setPassword("alllowercase");
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserPasswordWithAllUpperCase_receiveBadRequest() {
        User user = createValidUser();
        user.setPassword("ALLUPPERCASE");
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserPasswordWithAllNumber_receiveBadRequest() {
        User user = createValidUser();
        user.setPassword("12345567654");
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserIsInvalid_receiveApiError() {
        User user = new User();
        ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
        assertThat(response.getBody().getUrl()).isEqualTo(API_V_1_0_USERS);
    }

    @Test
    public void postUser_whenUserIsInvalid_receiveApiErrorWithValidationErrors() {
        User user = new User();
        ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
        assertThat(response.getBody().getValidationErrors().size()).isEqualTo(3);
    }

    @Test
    public void postUser_whenUserHasNullUsername_receiveMessageOfNullErrorForUsername() {
        User user = createValidUser();
        user.setUsername(null);
        ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
        Map<String, String> validationErrors = response.getBody().getValidationErrors();
        assertThat(validationErrors.get("username")).isEqualTo("Username cannot be null");
    }

    @Test
    public void postUser_whenUserHasNullPassword_receiveGenericMessageOfNullError() {
        User user = createValidUser();
        user.setPassword(null);
        ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
        Map<String, String> validationErrors = response.getBody().getValidationErrors();
        assertThat(validationErrors.get("password")).isEqualTo("Cannot be null");
    }

    @Test
    public void postUser_whenUserHasInvalidLengthUsername_receiveGenericMessageOfSizeError() {
        User user = createValidUser();
        user.setUsername("abc");
        ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
        Map<String, String> validationErrors = response.getBody().getValidationErrors();
        assertThat(validationErrors.get("username")).isEqualTo("It must have minimum 4 and maximum 255 characters");
    }

    @Test
    public void postUser_whenUserHasInvalidPasswordPattern_receiveMessageOfPasswordPatternError() {
        User user = createValidUser();
        user.setPassword("alllowercase");
        ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
        Map<String, String> validationErrors = response.getBody().getValidationErrors();
        assertThat(validationErrors.get("password")).isEqualTo("Password must have at least one uppercase, one lowercase letter and one number");
    }

    @Test
    public void postUser_whenAnotherUserHasSameUsername_receiveBadRequest() {
        userRepository.save(createValidUser());
        User user = createValidUser();
        ResponseEntity<Object> response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenAnotherUserHasSameUsername_receiveMessageOfDuplicationUsername() {
        userRepository.save(createValidUser());
        User user = createValidUser();
        ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
        Map<String, String> validationErrors = response.getBody().getValidationErrors();
        assertThat(validationErrors.get("username")).isEqualTo("This name is in use");
    }

    @Test
    public void getUsers_whenThereAreNoUsersInDB_receiveOK() {
        ResponseEntity<Object> response = getUsers(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getUsers_whenThereAreNoUsersInDB_receivePageWithZeroItems() {
        ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getUsers_whenThereIsAUserInDB_receivePageWithUser() {
        userRepository.save(TestUtil.createValidUser());
        ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getNumberOfElements()).isEqualTo(1);
    }

    @Test
    public void getUsers_whenThereIsAUserInDB_receiveUserWithoutPassword() {
        userRepository.save(TestUtil.createValidUser());
        ResponseEntity<TestPage<Map<String, Object>>> response = getUsers(new ParameterizedTypeReference<>() {
        });
        Map<String, Object> entity = response.getBody().getContent().get(0);
        assertThat(entity.containsKey("password")).isFalse();
    }

    @Test
    public void getUsers_whenPageIsRequestedFor3ItemsPerPageWhereTheDatabaseHas20Users_receive3Users() {
        IntStream.rangeClosed(1, 20).mapToObj(i -> "test-user-" + i)
                .map(TestUtil::createValidUser)
                .forEach(userRepository::save);
        String path = API_V_1_0_USERS + "?page=0&size=3";
        ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getContent().size()).isEqualTo(3);
    }

    @Test
    public void getUsers_whenPageSizeNotProvided_receivePageSizeAs10() {
        ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getSize()).isEqualTo(10);
    }

    @Test
    public void getUsers_whenPageSizeIsGreaterThan100_receivePageSizeAs100() {
        String path = API_V_1_0_USERS + "?size=500";
        ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getSize()).isEqualTo(100);
    }

    @Test
    public void getUsers_whenPageSizeIsNegative_receivePageSizeAs10() {
        String path = API_V_1_0_USERS + "?size=-5";
        ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getSize()).isEqualTo(10);
    }

    @Test
    public void getUsers_whenPageIsNegative_receiveFirstPage() {
        String path = API_V_1_0_USERS + "?page=-5";
        ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getNumber()).isEqualTo(0);
    }

    @Test
    public void getUsers_whenUserLoggedIn_receivePageWithouLoggedInUser() {
        userService.save(TestUtil.createValidUser("user1"));
        userService.save(TestUtil.createValidUser("user2"));
        userService.save(TestUtil.createValidUser("user3"));
        authenticate("user1");
        ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(2);
    }

//    @Test
//    public void getUserByUsername_whenUserExist_receiveOk() {
//        String username = "test-user";
//        userService.save(TestUtil.createValidUser(username));
//        ResponseEntity<Object> response = getUser(username, Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//    }
//
//    @Test
//    public void getUserByUsername_whenUserExist_receiveUserWithoutPassword() {
//        String username = "test-user";
//        userService.save(TestUtil.createValidUser(username));
//        ResponseEntity<String> response = getUser(username, String.class);
//        assertThat(response.getBody().contains("password")).isFalse();
//    }
//    @Test
//    public void getUserByUsername_whenUserDoesNotExist_receiveNotFound() {
//        ResponseEntity<Object> response = getUser("unknown-user", Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
//    }
//    @Test
//    public void getUserByUsername_whenUserDoesNotExist_receiveApiError() {
//        ResponseEntity<ApiError> response = getUser("unknown-user", ApiError.class);
//        assertThat(response.getBody().getMessage().contains("unknown-use")).isTrue();
//    }
//
//    @Test
//    public void putUser_whenUnauthorizedUserSendsTheRequest_receiveUnauthorized() {
//        ResponseEntity<Object> response = putUser(123, null, Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
//    }
//
//    @Test
//    public void putUser_whenAuthorizedUserSendsUpdateForAnotherUser_receiveForbidden() {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//
//        long anotherUserId = user.getId() + 123;
//        ResponseEntity<Object> response = putUser(anotherUserId, null, Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
//    }
//
//    @Test
//    public void putUser_whenUnauthorizedUserSendsTheRequest_receiveApiError() {
//        ResponseEntity<ApiError> response = putUser(123, null, ApiError.class);
//        assertThat(response.getBody().getUrl()).contains("users/123");
//    }
//
//    @Test
//    public void putUser_whenAuthorizedUserSendsUpdateForAnotherUser_receiveApiError() {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//
//        long anotherUserId = user.getId() + 123;
//        ResponseEntity<ApiError> response = putUser(anotherUserId, null, ApiError.class);
//        assertThat(response.getBody().getUrl()).contains("users/"+anotherUserId);
//    }
//
//    @Test
//    public void putUser_whenValidRequestBodyFromAuthorizedUser_receiveOk() {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<Object> response = putUser(user.getId(), requestEntity, Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//    }
//
//    @Test
//    public void putUser_whenValidRequestBodyFromAuthorizedUser_displayNameUpdated() {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        putUser(user.getId(), requestEntity, Object.class);
//
//        User userInDB = userRepository.findByUsername("user1");
//        assertThat(userInDB.getDisplayName()).isEqualTo(updatedUser.getDisplayName());
//    }
//
//    @Test
//    public void putUser_whenValidRequestBodyFromAuthorizedUser_receiveUserVMWithUpdatedDisplayName() {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);
//
//        assertThat(response.getBody().getDisplayName()).isEqualTo(updatedUser.getDisplayName());
//    }
//
//    @Test
//    public void putUser_withValidRequestBodyWithSupportedImageFromAuthorizedUser_receiveUserVMWithRandomImageName() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//        String imageString = readFileToBase64("profile.png");
//        updatedUser.setImage(imageString);
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);
//
//        assertThat(response.getBody().getImage()).isNotEqualTo("profile-image.png");
//    }
//
//    @Test
//    public void putUser_withValidRequestBodyWithSupportedImageFromAuthorizedUser_imageIsStoredUnderProfileFolder() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//        String imageString = readFileToBase64("profile.png");
//        updatedUser.setImage(imageString);
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);
//
//        String storedImageName = response.getBody().getImage();
//
//        String profilePicturePath = appConfiguration.getFullProfileImagesPath() + "/" + storedImageName;
//
//        File storedImage = new File(profilePicturePath);
//        assertThat(storedImage.exists()).isTrue();
//    }
//
//
//    @Test
//    public void putUser_withInvalidRequestBodyWithNullDisplayNameFromAuthorizedUser_receiveBadRequest() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = new UserUpdateVM();
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<Object> response = putUser(user.getId(), requestEntity, Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
//    }
//
//    @Test
//    public void putUser_withInvalidRequestBodyWithLessThanMinSizeDisplayNameFromAuthorizedUser_receiveBadRequest() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = new UserUpdateVM();
//        updatedUser.setDisplayName("abc");
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<Object> response = putUser(user.getId(), requestEntity, Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
//    }
//
//    @Test
//    public void putUser_withInvalidRequestBodyWithMoreThanMaxSizeDisplayNameFromAuthorizedUser_receiveBadRequest() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = new UserUpdateVM();
//
//        String valueOf256Chars = IntStream.rangeClosed(1,256).mapToObj(x -> "a").collect(Collectors.joining());
//        updatedUser.setDisplayName(valueOf256Chars);
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<Object> response = putUser(user.getId(), requestEntity, Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
//    }
//
//
//    @Test
//    public void putUser_withValidRequestBodyWithJPGImageFromAuthorizedUser_receiveOk() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//        String imageString = readFileToBase64("test-jpg.jpg");
//        updatedUser.setImage(imageString);
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//    }
//
//
//    @Test
//    public void putUser_withValidRequestBodyWithGIFImageFromAuthorizedUser_receiveBadRequest() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//        String imageString = readFileToBase64("test-gif.gif");
//        updatedUser.setImage(imageString);
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<Object> response = putUser(user.getId(), requestEntity, Object.class);
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
//    }
//
//    @Test
//    public void putUser_withValidRequestBodyWithTXTImageFromAuthorizedUser_receiveValidationErrorForProfileImage() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//        String imageString = readFileToBase64("test-txt.txt");
//        updatedUser.setImage(imageString);
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<ApiError> response = putUser(user.getId(), requestEntity, ApiError.class);
//        Map<String, String> validationErrors = response.getBody().getValidationErrors();
//        assertThat(validationErrors.get("image")).isEqualTo("Only PNG and JPG files are allowed");
//    }
//
//    @Test
//    public void putUser_withValidRequestBodyWithJPGImageForUserWhoHasImage_removesOldImageFromStorage() throws IOException {
//        User user = userService.save(TestUtil.createValidUser("user1"));
//        authenticate(user.getUsername());
//        UserUpdateVM updatedUser = createValidUserUpdateVM();
//        String imageString = readFileToBase64("test-jpg.jpg");
//        updatedUser.setImage(imageString);
//
//        HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser);
//        ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);
//
//        putUser(user.getId(), requestEntity, UserVM.class);
//
//        String storedImageName = response.getBody().getImage();
//        String profilePicturePath = appConfiguration.getFullProfileImagesPath() + "/" + storedImageName;
//        File storedImage = new File(profilePicturePath);
//        assertThat(storedImage.exists()).isFalse();
//    }

    //    private String readFileToBase64(String fileName) throws IOException {
//        ClassPathResource imageResource = new ClassPathResource(fileName);
//        byte[] imageArr = FileUtils.readFileToByteArray(imageResource.getFile());
//        String imageString = Base64.getEncoder().encodeToString(imageArr);
//        return imageString;
//    }
//
//    private UserUpdateVM createValidUserUpdateVM() {
//        UserUpdateVM updatedUser = new UserUpdateVM();
//        updatedUser.setDisplayName("newDisplayName");
//        return updatedUser;
//    }
//
    private void authenticate(String username) {
        testRestTemplate.getRestTemplate()
                .getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword"));
    }

    public <T> ResponseEntity<T> postSignup(Object request, Class<T> response) {
        return testRestTemplate.postForEntity(API_V_1_0_USERS, request, response);
    }

    public <T> ResponseEntity<T> getUsers(ParameterizedTypeReference<T> responseType) {
        return testRestTemplate.exchange(API_V_1_0_USERS, HttpMethod.GET, null, responseType);
    }

    public <T> ResponseEntity<T> getUsers(String path, ParameterizedTypeReference<T> responseType) {
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

//    public <T> ResponseEntity<T> getUser(String username, Class<T> responseType){
//        String path = API_V_1_0_USERS + "/" + username;
//        return testRestTemplate.getForEntity(path, responseType);
//    }
//
//    public <T> ResponseEntity<T> putUser(long id, HttpEntity<?> requestEntity, Class<T> responseType){
//        String path = API_V_1_0_USERS + "/" + id;
//        return testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, responseType);
//    }
//
//    @AfterEach
//    public void cleanDirectory() throws IOException {
//        FileUtils.cleanDirectory(new File(appConfiguration.getFullProfileImagesPath()));
//        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
//    }

}
