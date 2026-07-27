package com.cfs.cms.repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.cfs.cms.entity.Fees;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeesRepository extends JpaRepository<Fees, Long> {

    @Query("SELECT MONTHNAME(f.paymentDate), SUM(f.paidAmount) FROM Fees f GROUP BY MONTHNAME(f.paymentDate), MONTH(f.paymentDate) ORDER BY MONTH(f.paymentDate)")
    List<Object[]> getMonthlyFeesCollection();


    List<Fees> findTop2ByOrderByReceiptIdDesc();

    List<Fees> findByReceiptNoContainingIgnoreCase(String receiptNo);

}