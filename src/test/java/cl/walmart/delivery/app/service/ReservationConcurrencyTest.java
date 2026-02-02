package cl.walmart.delivery.app.service;

import cl.walmart.delivery.domain.ports.ReservationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ReservationConcurrencyTest {

    @Autowired
    private ReservationAppService service;

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    void should_not_over_reserve_under_concurrency() throws Exception {
        String address = "Santiago 123";
        String windowId = "w-20260128-1";

        int threads = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch latch = new CountDownLatch(threads);

        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < threads; i++) {
            futures.add(executor.submit(() -> {
                try {
                    service.reserve(address, windowId);
                } catch (Exception ignored) {
                } finally {
                    latch.countDown();
                }
            }));
        }

        latch.await(5, TimeUnit.SECONDS);
        executor.shutdownNow();

        long totalReservations = reservationRepository.findByWindowId(windowId).size();

        assertThat(totalReservations).isLessThanOrEqualTo(3);
    }
}
