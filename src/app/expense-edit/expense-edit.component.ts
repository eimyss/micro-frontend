import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../shared/expense/expense.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrls: ['./expense-edit.component.css']
})
export class ExpenseEditComponent implements OnInit,OnDestroy {
  expense: any = {};
  sub: Subscription;

 constructor(private route: ActivatedRoute,
             private router: Router,
             private expenseService: ExpenseService,
             private giphyService: GiphyService) {
 }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
    const id = params['id'];
    if (id) {
      this.expenseService.get(id).subscribe((expense: any) => {
        if (expense) {
          this.expense = expense;
          this.expense.href = expense._links.self.href;
          this.giphyService.get(expense.name).subscribe(url => expense.giphyUrl = url);
        } else {
          console.log(`Expense with id '${id}' not found, returning to list`);
          this.gotoList();
        }
      });
    }
  });
  }
  ngOnDestroy() {
  this.sub.unsubscribe();
}


  gotoList() {
    this.router.navigate(['/expense-list']);
  }

  save(form: NgForm) {
    this.expenseService.save(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

  remove(href) {
    this.expenseService.remove(href).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

}